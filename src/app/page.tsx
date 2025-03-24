import DisplayProductsList from "./component/DisplayProductsList";
import TotalPrice from "./component/TotalPrice";

export default function Home() {
  return (
    <div style={{ padding: "4em" }}>
      {/* เรียก component */}
      <DisplayProductsList />
      <TotalPrice/>
    </div>
  );
}
