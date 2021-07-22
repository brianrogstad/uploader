import { Component, ViewChild, ElementRef } from "@angular/core";
import { AlertService } from "./components/alert/alert.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent {

  constructor(
    private alertService: AlertService
  ) {
    this.alertService = alertService;
}

  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  files: any[] = [];
  uploadInProgress = false;

  /**
   * on file drop handler
   * @param event (files being dropped)
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   * @param files (Files List)
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    console.log(this.uploadInProgress);
    if (this.files[index].progress < 100 || this.uploadInProgress) {
      this.alertService.warn("Upload in progress.", { autoClose: true });
      return;
    } else {
      this.files.splice(index, 1);
      this.alertService.error("File Removed", { autoClose: true });
    }
  }

  /**
   * Simulate the upload process
   * @param index (File index)
   */
  uploadFilesSimulator(index: number) {
    this.uploadInProgress = true;

    setTimeout(() => {
      if (index === this.files.length) {
        this.uploadInProgress = false;
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else if (this.files[index].progress === 95) {
            this.uploadFinished();
            this.files[index].isComplete = true;
            this.files[index].showCheck = true;
            this.files[index].showClose = false;
            this.files[index].progress += 5;
          }
          else {
            this.files[index].progress += 5;
          }
        }, 100);
      }
    }, 200);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      item.showClose = true;
      this.setFileIcon(item);
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(0);
  }

  uploadFinished () {
    setTimeout(() => {
      this.alertService.success("Upload Complete.", { autoClose: true });
    }, 200);
  }

  /**
   * Get File types to display correct icon
   * @param file (Each File)
   */
   setFileIcon(file) {
      const fileExtensionExpression = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi

      switch((file.name).match(fileExtensionExpression)[0]) {
        case '.pdf':
          file.icon = 'pdf';
          break;
        case '.ai':
          file.icon = 'ai';
          break;
        case '.psd':
          file.icon = 'psd';
          break;
        case '.doc':
          file.icon = 'doc';
          break;
        case '.xls':
          file.icon = 'xls';
          break;
        case '.xlsx':
          file.icon = 'xls';
          break;
        case '.png':
          file.icon = 'png';
          break;
        case '.jpg':
          file.icon = 'jpg';
          break;
        default:
          file.icon = 'blank';
     }
  }

  /**
   * Toggle Hide/Show classes on check and close icons when hovered
   * @param index (File Index)
   */
  hoverIcon(index: number) {
    if (this.files[index].progress < 100) {
      return; // do nothing if progress bar is still moving
    } else {
      this.files[index].showCheck = false;
      this.files[index].showClose = true;
    }
  }

  /**
   * Toggle Hide/Show classes on check and close icons when mouse leaves hover
   * @param index (File Index)
   */
  leaveIcon(index: number) {
    if (this.files[index].progress < 100) {
      return; // do nothing if progress bar is still moving
    } else {
      this.files[index].showCheck = true;
      this.files[index].showClose = false;
    }
  }
}
