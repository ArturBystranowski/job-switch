import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DevUserProvider } from './context';
import {
  LandingPage,
  QuestionnairePage,
  UploadCVPage,
  RecommendationsPage,
  RoadmapPage,
  ProfilePage,
} from './pages';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
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
]);

function App() {
  return (
    <DevUserProvider>
      <RouterProvider router={router} />
    </DevUserProvider>
  );
}

export default App;
