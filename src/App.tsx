import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute, RootLayout } from './components/layout';
import {
  LandingPage,
  QuestionnairePage,
  UploadCVPage,
  RecommendationsPage,
  RoadmapPage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Public routes
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/questionnaire',
            element: <QuestionnairePage />,
          },
          {
            path: '/upload-cv',
            element: <UploadCVPage />,
          },
          {
            path: '/recommendations',
            element: <RecommendationsPage />,
          },
          {
            path: '/roadmap',
            element: <RoadmapPage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
