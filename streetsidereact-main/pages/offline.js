import Link from "next/link";

const OfflinePage = () => (
  <main
    style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      textAlign: "center",
    }}
  >
    <section>
      <h1>You’re offline</h1>
      <p>
        Previously viewed content may still be available. Reconnect and try
        again for live marketplace data.
      </p>
      <Link href="/">Try again</Link>
    </section>
  </main>
);

export default OfflinePage;
