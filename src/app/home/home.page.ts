import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonItem, IonInput, IonTextarea, IonButton, IonText, 
  IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, AlertController, ToastController, IonSearchbar, IonBadge, IonFab, IonFabButton, IonLabel
} from '@ionic/angular/standalone';
import { DataMahasiswaService } from '../services/data-mahasiswa';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonItem, IonInput, IonTextarea, IonButton, IonText,
    IonSelect, IonSelectOption,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonIcon, IonSearchbar, IonBadge, IonFab, IonFabButton, IonLabel,
    CommonModule, FormsModule, ReactiveFormsModule
  ],
})
export class HomePage implements OnInit {

  @ViewChild('namaInput', { static: false }) namaInput?: IonInput;

  formMahasiswa!: FormGroup;
  dataMahasiswa: any[] = [];
  filterText: string = '';
  editingId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dataService: DataMahasiswaService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.formMahasiswa = this.fb.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      nim: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      jurusan: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      alamat: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.dataMahasiswa = await this.dataService.getData() || [];
    // tampilkan yang terbaru paling atas
    this.dataMahasiswa.sort((a,b)=> b.id - a.id);
  }

  async simpanData() {
    if (this.formMahasiswa.valid) {
      if (this.editingId) {
        // update existing
        await this.dataService.updateData(this.editingId, this.formMahasiswa.value);
        this.editingId = null;
        const toast = await this.toastCtrl.create({ message: 'Data berhasil diperbarui', duration: 1600, color: 'success' });
        await toast.present();
      } else {
        await this.dataService.tambahData(this.formMahasiswa.value);
        const toast = await this.toastCtrl.create({ message: 'Data berhasil disimpan', duration: 1800, color: 'success' });
        await toast.present();
      }

      this.formMahasiswa.reset();
      await this.loadData();
    } else {
      this.markFormGroupTouched(this.formMahasiswa);
      const toast = await this.toastCtrl.create({
        message: 'Periksa kembali form, ada field yang belum valid',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
    }
  }

  async hapusData(id: number) {
    // gunakan dialog Ionic
    const alert = await this.alertCtrl.create({
      header: 'Konfirmasi',
      message: 'Yakin ingin menghapus data ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          handler: async () => {
            await this.dataService.hapusData(id);
            await this.loadData();
            const toast = await this.toastCtrl.create({
              message: 'Data berhasil dihapus',
              duration: 1500,
              color: 'danger'
            });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  async showDetail(mhs: any) {
    const alert = await this.alertCtrl.create({
      header: mhs.nama || 'Detail Mahasiswa',
      subHeader: `NIM: ${mhs.nim || '-'} | Jurusan: ${mhs.jurusan || '-'} `,
      message: `<p><b>Email:</b> ${mhs.email || '-'}</p><p><b>Alamat:</b> ${mhs.alamat || '-'}</p>`,
      buttons: ['Tutup']
    });
    await alert.present();
  }

  focusName() {
    this.namaInput?.setFocus();
  }

  get filteredData() {
    const q = this.filterText?.trim().toLowerCase();
    if (!q) return this.dataMahasiswa;
    return this.dataMahasiswa.filter(m => {
      return (m.nama || '').toLowerCase().includes(q) ||
             (m.nim || '').toString().includes(q) ||
             (m.jurusan || '').toLowerCase().includes(q) ||
             (m.email || '').toLowerCase().includes(q);
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  editData(mhs: any) {
    this.editingId = mhs.id;
    this.formMahasiswa.patchValue({
      nama: mhs.nama,
      nim: mhs.nim,
      jurusan: mhs.jurusan,
      email: mhs.email,
      alamat: mhs.alamat
    });
    this.focusName();
  }

  cancelEdit() {
    this.editingId = null;
    this.formMahasiswa.reset();
  }
}
