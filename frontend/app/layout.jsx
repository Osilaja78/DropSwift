import "@fontsource/poppins";
import Footer from "@/components/footer";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "@/components/auth/AuthContext";

const toastParams = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  
export const notify = (val) => toast.success(`${val}`, toastParams);
export const warn = (val) => toast.error(`${val}`, toastParams);
export const inform = (val) => toast.info(`${val}`, toastParams);

 
export default function RootLayout({ children }) {
 return (
    <AuthProvider>
      <html lang="en">
        <body>
          {/* <Navbar /> */}
          {children}
          <Footer />
        </body>
      </html>
    </AuthProvider>
  )
}
