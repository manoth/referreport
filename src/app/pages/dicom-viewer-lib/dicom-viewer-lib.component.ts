import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-dicom-viewer-lib',
  templateUrl: './dicom-viewer-lib.component.html',
  styleUrls: ['./dicom-viewer-lib.component.scss']
})
export class DicomViewerLibComponent implements OnInit {

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
    this.main.inputHeader({ path: '/adduser', name: 'เพิ่มบัญชีผู้ใช้', icon: 'fa-user-plus', ifdname: false, dname: '' });
  }

  /**
   * Load selected DICOM images
   *
   * @param files list of selected dicom files
   */
  loadDICOMImages(files: FileList) {
    if (files && files.length > 0) {
      alert('Escolha imagens DICOM a exibir.');
    } else alert('Escolha imagens DICOM a exibir.');
  }
}