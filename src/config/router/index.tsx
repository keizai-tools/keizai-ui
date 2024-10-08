import { Navigate, createBrowserRouter } from 'react-router-dom';

import { CollectionVariablesContainer } from '@/common/components/Collections/CollectionVariablesContainer';
import AuthPage from '@/pages/auth/authPage';
import ChangePassword from '@/pages/auth/changePassword';
import CreateAccount from '@/pages/auth/createAccount';
import Login from '@/pages/auth/login';
import ProtectedRoute from '@/pages/auth/protectedRoute';
import RecoverPassword from '@/pages/auth/recoverPassword';
import ResetPassword from '@/pages/auth/resetPassword';
import CollectionCTAPage from '@/pages/collection/collectionCTAPage';
import CollectionPage from '@/pages/collection/collectionPage';
import InvocationByCollection from '@/pages/collection/invocationbycollection';
import Home from '@/pages/home/home';
import InvocationPage from '@/pages/invocation/invocationPage';
import Root from '@/pages/root';
import Providers from '@/providers/providers';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Providers />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            ),
          },
          {
            path: 'change-password',

            element: (
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            ),
          },
          {
            path: 'collection/:collectionId',
            element: (
              <ProtectedRoute>
                <CollectionPage />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute>
                    <CollectionCTAPage />
                  </ProtectedRoute>
                ),
              },

              {
                path: 'variables',
                element: (
                  <ProtectedRoute>
                    <CollectionVariablesContainer />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'invocation/:invocationId',
                element: (
                  <ProtectedRoute>
                    <InvocationPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'invocations',
                element: (
                  <ProtectedRoute>
                    <InvocationByCollection />
                  </ProtectedRoute>
                ),
              },
            ],
          },
        ],
      },
      {
        path: '/auth',
        element: <AuthPage />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <CreateAccount />,
          },
          {
            path: 'forgot-password',
            element: <RecoverPassword />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default router;
