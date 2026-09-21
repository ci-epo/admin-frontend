import Spinner from "@/components/ui/spinner/Spinner";

export default function AdminLoading() {
  return (
    <div className="d-flex justify-content-center py-5 position-relative z-1">
      <Spinner />
    </div>
  );
}
