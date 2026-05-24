import DashboardClient from "./page.client";

export default function Page({ params }: { params: { id: string } }) {
  return <DashboardClient merchantId={params.id} />;
}
