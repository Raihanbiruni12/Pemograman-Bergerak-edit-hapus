import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DataMahasiswaService {

  private KEY_MAHASISWA = 'data_mahasiswa_app';

  constructor() {}

  // Ambil semua data mahasiswa
  async getData(): Promise<any[]> {
    const { value } = await Preferences.get({ key: this.KEY_MAHASISWA });
    return value ? JSON.parse(value) : [];
  }

  // Tambah data mahasiswa
  async tambahData(mahasiswaBaru: any) {
    const dataLama = await this.getData();

    // kasih ID unik
    mahasiswaBaru.id = Date.now();
    dataLama.push(mahasiswaBaru);

    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataLama)
    });
  }

  // Hapus data mahasiswa berdasarkan ID
  async hapusData(id: number) {
    const dataLama = await this.getData();
    const dataBaru = dataLama.filter(item => item.id !== id);

    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataBaru)
    });
  }

  // Update data mahasiswa by ID
  async updateData(id: number, mahasiswaUpdated: any) {
    const dataLama = await this.getData();
    const dataBaru = dataLama.map(item => {
      if (item.id === id) {
        return { ...item, ...mahasiswaUpdated, id };
      }
      return item;
    });

    return await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataBaru)
    });
  }
}
