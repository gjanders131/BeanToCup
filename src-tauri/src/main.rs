// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rfd::FileDialog;
// use tauri::api;
// use std::io::{self, Read, Write};
use std::fs::{self};


// static WORKSPACE: &str = api::path::document_dir().unwrap().to_str().unwrap() ;


#[tauri::command]
fn open_dir(base_path:&str) -> Result<String, String> {
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
  .set_directory("/")
  .add_filter("B2C Workspace", &[".b2cworkspace"])
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
fn create_workspace() -> Result<String, String> {
  let folder = FileDialog::new()
  .set_directory("/")
  .set_title("Select a folder")
  .pick_folder();

  match folder {
    Some(_) => (),
    None => return Err("No folder selected".to_string())
  };

  let folder_path = folder.unwrap().to_str().unwrap().to_string();
  let path = format!("{}/b2cWorkspace.b2cworkspace", folder_path);
  let contents = "{}";
  fs::write(path, contents).expect_err("Error creating workspace file");
  return Ok(folder_path)
}


fn main() {

  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![create_workspace,open_dir,open_file,open_workspace])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
