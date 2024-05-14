// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rfd::{FileDialog, MessageDialog, MessageLevel};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::api::{self, dir::read_dir};
use std::fs;

#[tauri::command]
fn open_dir(base_path:String) -> Result<String, String> {
  let folder = FileDialog::new()
  .set_directory(base_path)
  .set_title("Select a folder")
  .pick_folder();

  match folder {
    Some(_) => (),
    None => return Err("No folder selected".to_string())
  };
  let folder_path = folder.unwrap().to_str().unwrap().to_string();
  return Ok(folder_path)
}

#[tauri::command]
fn open_file(base_path:&str) -> Result<String, String> {
  let file = FileDialog::new()
  .set_directory(base_path)
  .set_title("Select a file")
  .pick_file();

  match file {
    Some(_) => (),
    None => return Err("No file selected".to_string())
  };
  let file_path = file.unwrap().to_str().unwrap().to_string();
  return Ok(file_path);
}

#[tauri::command]
fn open_workspace() -> Result<String, String> {
  let file = FileDialog::new()
  .set_directory(api::path::document_dir().unwrap().as_path())

  // .add_filter("B2C Workspace", &[".b2cworkspace"])
  .set_title("Select a B2C Workspace")
  .pick_file();

  match file {
    Some(_) => (),
    None => return Err("No file selected".to_string())
  };
  let file_path = file.unwrap().to_str().unwrap().to_string();
  return Ok(file_path);
}

#[tauri::command]
fn create_workspace(path:String, name:String) -> Result<String, String> {
  let dupe_check;
  // Check if directory exists
  let dir_check = read_dir(path.clone(), false);
  match dir_check {
    // If directory exists, check if workspace already exists
    Ok(dir) => dupe_check = dir.into_iter().find(|dir| dir.path.extension().is_some_and(|ext| ext == "b2cworkspace")),
    Err(_) => return Err("Invalid directory".to_string())
  };
  // If workspace exists, return error
  match dupe_check {
    Some(_) => return Err("A Workspace already exists in this folder".to_string()),
    None => ()
  };

  // Create workspace file
  let file_path = format!("{}/{}.b2cworkspace", path, name);
  let contents = "{}";
  let workspace_file = fs::write(file_path.clone(), contents);

  // If file was created, return file path
  match workspace_file {
    Ok(_) => return Ok(file_path),
    Err(_) => return Err("Unable to create workspace file".to_string())
  };
}

#[tauri::command]
fn validate_text(text:String) -> Result<String, String> {
  let disallowed_chars = vec!["<", ">", ":", "\"", "/", "\\", "|", "?", "*", ".", " ", "!", "@", "#", "$", "%", "^", "&", "(", ")", "[", "]", "{", "}", ";", ",", "+", "=", "`", "~", "'", "’"];
  for char in disallowed_chars {
    if text.contains(char) {
      return Err(format!("Character \"{}\" is not allowed", char));
    }
  }
  return Ok(text);
}

#[tauri::command]
fn get_workspace(workspace_path: String) -> Result<String, String> {
  let workspace = fs::read_to_string(workspace_path);
  match workspace {
    Ok(content) => return Ok(content),
    Err(_) => return Err("Unable to read workspace".to_string())
  };
}

fn process_json(json:String) -> Result<Value, serde_json::Error> {
  let json_string = serde_json::from_str::<Value>(json.as_str())?;
  return Ok(json_string);
}

#[tauri::command]
fn write_categories_into_workspace(workspace:String, content:String) -> Result<String, String> {

  let json_string = process_json(content);
  let dirs = match json_string {
    Ok(jstring) => jstring,
    Err(err) => return Err(err.to_string())
  };
  
  let workspace_content = fs::read_to_string(&workspace);
  match workspace_content {
    Ok(content) => {
      let mut json_content = serde_json::from_str::<Value>(&content).expect("Unable to convert content to JSON");
      json_content["categories"] = serde_json::to_value(&dirs).expect("Unable to write categories to JSON");
      let update_workspace = fs::write(workspace, serde_json::to_string_pretty(&json_content).expect("Unable to write JSON to string"));
      match update_workspace {
        Ok(_) => return Ok("Success".to_string()),
        Err(_) => return Err("Unable to write to workspace".to_string())
      };
    },
    Err(err) => return Err(err.to_string())
  };
}


#[tauri::command]
fn message_box(message:String) {
  MessageDialog::new()
  .set_description(message)
  .set_level(MessageLevel::Error)
  .show();
}

fn main() {

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      create_workspace,
      open_dir,
      open_file,
      open_workspace,
      message_box, 
      validate_text, 
      write_categories_into_workspace,
      get_workspace
      ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
