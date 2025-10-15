# Aplikasi Comic Reader
Proses deployment untuk aplikasi Comic Reader.

1. Ringkasan Proyek
Aplikasi ini adalah sebuah platform pembaca komik berbasis web yang dibangun dengan antarmuka pengguna modern dan interaktif.

Arsitektur dan Teknologi
- Frontend: React, Vite, TypeScript

- UI/Styling: shadcn-ui, Tailwind CSS

- Backend/Database: Supabase (dikelola melalui layanan eksternal Lovable Cloud)

- Containerization: Docker

- Orchestration: Kubernetes
note: kode aplikasi di kelola oleh Ai Lovable dan Saya 

2. Deployment Workflow
Berikut rincian bagaimana saya melakukan management proyek ini.

- Containerization: Aplikasi dikemas sebagai image Docker menggunakan Dockerfile dengan menggunakan multi-stage build untuk optimasi ukuran dan keamanan.

- Tahap Build: Tahap pertama (builder) di dalam Dockerfile menggunakan base image node:18-alpine. Tahap ini bertanggung jawab untuk menginstal dependensi dan mengkompilasi aplikasi TypeScript/React menjadi aset statis (HTML, CSS, JS) di dalam direktori /dist.

- Tahap Produksi: Tahap kedua (production) menggunakan base image nginx:stable-alpine yang ringan. Hasil kompilasi (folder /dist) dari tahap builder disalin ke direktori root Nginx.

- Penyajian Konten: Nginx di dalam container bertugas menyajikan file statis tersebut, yang kemudian diekspos ke luar klaster melalui Service Kubernetes.

- Pengujian di lokal server. Sebelum diunggah, image Docker yang sudah jadi diuji secara lokal untuk memastikan container dapat berjalan tanpa masalah. Saya melakukan pengujian melalui VM local pribadi

- Jika image sudah bisa berjalan lancar di container saya melakukan push Image ke Docker Hub di repository saya

note berikut nama repository Docker Hub saya: https://hub.docker.com/u/mochabdulrouf

- Manifes Kubernetes: File manifes YAML (comic-deployment.yaml) disiapkan untuk mendefinisikan objek Deployment dan Service yang diperlukan.

- Deployment: Manifes diaplikasikan ke Cluster Kubernetes untuk memulai proses deployment.

- Pengujian: Aplikasi yang sudah berjalan diuji melalui NodePort yang telah ditentukan pada Service.

## Cara melakukan Deployment di Kubernetes

1. Menyiapkan file konfigurasi di server
```bash
vi comic-deployment.yaml
```

2. Isi file konfigurasinya
Contoh ada di file comic-deployment.yaml 

3. Lakukan Eksekusi menggunakan Command Declarative Management
```bash
kubectl apply -f comic-deployment.yaml
```

4. Cek apakah Deployment dan Service berjalan tanpa problem
```bash
kubectl get all
```

5. Pengujian saya akses ke EXTERNAL Port 30002 di file manifes, Untuk layanan Kubernetes saya menggunakan Playground KodeKloud untuk melakukan uji coba Production dan Implementasi sederhana. Visit ke website ini guys free main kubernetes buat device yang ga kuat https://kodekloud.com/studio/playgrounds/kubernetes/

## Documentation

1. File konfigurasi di eksekusi menggunakan command kubectl apply
```bash
controlplane ~/Production ➜  kubectl apply -f comic-deployment.yaml 
deployment.apps/comic-deployment created
service/comic-service created
```

2. Verifikasi apakah Deployment dan Service berjalan
```bash
controlplane ~/Production ➜  kubectl get all
NAME                                   READY   STATUS    RESTARTS   AGE
pod/comic-deployment-7c8bb954d-4xgws   1/1     Running   0          34s
pod/comic-deployment-7c8bb954d-j96b5   1/1     Running   0          34s
pod/comic-deployment-7c8bb954d-v6thr   1/1     Running   0          34s

NAME                    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
service/comic-service   NodePort    172.20.21.109   <none>        80:30002/TCP   35s
service/kubernetes      ClusterIP   172.20.0.1      <none>        443/TCP        74m

NAME                               READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/comic-deployment   3/3     3            3           36s

NAME                                         DESIRED   CURRENT   READY   AGE
replicaset.apps/comic-deployment-7c8bb954d   3         3         3       35s
```

3. Aplikasi di akses melalui browser menggunakan Port EXTERNAL 30002
![image-documentation-1](./image/image.png)

4. Verifikasi Koneksi Database, Dengan cara login ke website menggunakan akun admin.Aplikasi ini terhubung ke database External yang di kelola oleh Lovable Cloud (Berbasis Supabase), Keberhasilan login sebagai Admin menunjukan bahwa Pod didalam Cluster Kubernetes memiliki koneksi ke layanan database external.
![image-documentation-2](./image/image2.png)


gacorr cuyy anak IT banget