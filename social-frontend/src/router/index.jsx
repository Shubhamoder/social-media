import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import CreatePost from '../pages/CreatePost';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* Default Route: Redirect to /login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Specific Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/posts/create" element={<CreatePost />}/>
                {/* Fallback Route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
