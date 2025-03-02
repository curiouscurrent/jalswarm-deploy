export const metadata = {
  title: "Multi-Agent Trash Collection Dashboard",
  description: "A real-time dashboard for monitoring trash collection bots",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif" }}>{children}</body>
    </html>
  );
}
