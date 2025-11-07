import React from 'react';
import { AlertTriangle, ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';

const AuthSetupGuide: React.FC = () => {
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const environmentVariables = [
    { key: 'VITE_FIREBASE_API_KEY', value: 'your_firebase_api_key_here' },
    { key: 'VITE_FIREBASE_PROJECT_ID', value: 'your_firebase_project_id_here' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', value: 'your_firebase_auth_domain_here' },
    { key: 'VITE_FIREBASE_APP_ID', value: 'your_firebase_app_id_here' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', value: 'your_firebase_storage_bucket_here' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', value: 'your_firebase_messaging_sender_id_here' },
  ];

  const envFileContent = environmentVariables.map(env => `${env.key}=${env.value}`).join('\n');

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Authentication Setup Required
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            To enable authentication features, you need to configure Firebase environment variables.
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                1. Create a Firebase Project
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                Go to the Firebase Console and create a new project with Authentication enabled.
              </p>
              <a 
                href="https://console.firebase.google.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 dark:text-orange-400 dark:hover:text-orange-300"
              >
                Open Firebase Console <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                2. Get Your Firebase Configuration
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                In your Firebase project settings, copy the configuration values.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                3. Create Environment File
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                Create a <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">.env</code> file in your project root with these variables:
              </p>
              
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <button
                  onClick={() => copyToClipboard(envFileContent, 'env-file')}
                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedItem === 'env-file' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{envFileContent}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                4. Enable Authentication Providers
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                In Firebase Console → Authentication → Sign-in method, enable:
              </p>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc list-inside ml-4">
                <li>Email/Password</li>
                <li>Google (optional)</li>
                <li>LinkedIn (optional, requires additional setup)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                5. Restart Development Server
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                After setting up the environment variables, restart your development server with:
              </p>
              <div className="bg-gray-900 rounded-lg p-3 mt-2 relative">
                <button
                  onClick={() => copyToClipboard('npm run dev', 'restart-cmd')}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedItem === 'restart-cmd' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <code className="text-sm text-gray-300">npm run dev</code>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <p className="text-sm text-orange-700 dark:text-orange-300">
              <strong>Note:</strong> For production deployment, make sure to add these environment variables to your hosting platform (Vercel, Netlify, etc.).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSetupGuide;
