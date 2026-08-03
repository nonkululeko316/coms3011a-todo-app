import './globals.css';

export const metadata = {
  title: 'Todo App',
  description: 'Local-first task management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}