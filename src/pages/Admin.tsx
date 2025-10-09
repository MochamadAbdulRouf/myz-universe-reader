import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import AdminComics from "./AdminComics";
import AdminUsers from "./AdminUsers";

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

          <Tabs defaultValue="comics" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="comics" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Komik
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="comics">
              <AdminComics />
            </TabsContent>

            <TabsContent value="users">
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Admin;
