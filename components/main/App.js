import { useState, useEffect } from 'react';
import './App.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Modal } from '@mui/material';
import Signup from './components/signup/Signup';
import Login from './components/login/Login';
import BlogDetail from './components/blogdetail/BlogDetail';
import CreatePost from './components/admin/createpost/CreatePost';
import { toast, Toaster } from 'sonner';
import CourseDetail from './components/coursedetail/CourseDetail';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const ProtectedRoute = ({ element, logged, userEmail }) => {
    return logged ? React.cloneElement(element, { userEmail }) : <Navigate to="/" />;
};

function App() {
    const [open, setOpen] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState('');
    const [userEmail, setUserEmail] = useState(''); 
    const [loading, setLoading] = useState(true);

    const modalStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1400,
        bgcolor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflowY: 'auto',
        padding: '100px 20px 20px',
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setIsSignUp(false);
        setError('');
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('loggedUser');
        if (storedEmail) {
            setUserEmail(storedEmail);
            setLogged(true);
        }
    }, []);

    const handleLogout = () => {
        setLogged(false);
        localStorage.removeItem('loggedUser');
        setUserEmail('');
        setTimeout(() => window.location.reload(), 3000);
        toast.success('Logout successful!', { duration: 3000 });
    };

    return (
        <Router>
            <div className="App">
                <Toaster position="top-center" richColors />
                <ScrollToTop />
                <header>
                    <Header handleOpen={handleOpen} logged={logged} handleLogout={handleLogout} userEmail={userEmail} />
                </header>
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/courses" element={<Courses logged={logged} />} />
                        <Route path="/courses/:courseId" element={<CourseDetail userEmail={userEmail} handleOpen={handleOpen} logged={logged} />} />
                        <Route path="/blog/" element={<Blogs userEmail={userEmail} logged={logged} handleOpen={handleOpen} />} />
                        <Route path="/blog/create-post" element={<ProtectedRoute element={<CreatePost />} logged={logged} userEmail={userEmail} />} />
                        <Route path="/careers" element={<Careers setLoading={setLoading} />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard loading={loading} setLoading={setLoading} />} logged={logged} userEmail={userEmail} />} />
                        <Route path="/blog/:postId" element={<BlogDetail userEmail={userEmail} handleOpen={handleOpen} logged={logged} loading={loading} setLoading={setLoading} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <footer>
                    <Footer />
                </footer>
                <div className="float">
                    <a href="https://wa.me/919008761372" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="Chat with us on WhatsApp">
                        <WhatsAppIcon style={{ fontSize: '25px', color: 'white' }} />
                    </a>
                </div>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                    <Box sx={modalStyle}>
                        {isSignUp ? (
                            <Signup error={error} setError={setError} setIsSignUp={setIsSignUp} handleClose={handleClose} />
                        ) : (
                            <Login setLogged={setLogged} handleOpen={handleOpen} handleClose={handleClose} setIsSignUp={setIsSignUp} error={error} setError={setError} setUserEmail={setUserEmail} />
                        )}
                    </Box>
                </Modal>
            </div>
        </Router>
    );
}

export default App;
