import DisplayProductsList from "./component/DisplayProductsList";

export default function Home() {
  return (
    <div style={{ padding: "4em" }}>
      {/* เรียก component */}
      <DisplayProductsList />
    </div>
  );
}
