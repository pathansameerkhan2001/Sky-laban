import { Metadata } from "next";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata: Metadata = {
  title: "Admin Panel | Sky Laban Website Management",
  description: "Secure administrative management panel for Sky Laban products, orders, outlets, reels, and content.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
