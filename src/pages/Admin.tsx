import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Database, Lock } from "lucide-react";
import { motion } from "framer-motion";

const Admin = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mb-8">
            Kelola semua konten komik di Myz Universe
          </p>

          {/* Info Card */}
          <Card className="mb-8 border-primary/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Lovable Cloud Required
              </CardTitle>
              <CardDescription>
                Dashboard admin akan sepenuhnya berfungsi setelah Lovable Cloud diaktifkan.
                Anda akan dapat mengelola database, upload gambar, dan CRUD komik.
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features Preview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="hover-glow cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Kelola Komik</CardTitle>
                  <CardDescription>
                    Tambah, edit, atau hapus komik dengan mudah
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" disabled>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Komik
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="hover-glow cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Database Management</CardTitle>
                  <CardDescription>
                    Akses langsung ke database Lovable Cloud
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Buka Database
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="hover-glow cursor-pointer h-full">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Upload Gambar</CardTitle>
                  <CardDescription>
                    Upload cover dan halaman komik ke storage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" disabled>
                    Upload File
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
