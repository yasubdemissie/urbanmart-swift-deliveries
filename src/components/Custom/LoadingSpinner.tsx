export default function LoadingSpinner({
  message,
  type = "large",
}: {
  message: string;
  type: "small" | "large";
}) {
  return (
    <div
      className={`${
        type === "small"
          ? "h-40 w-full rounded-lg m-1 bg-gray-100"
          : "min-h-screen bg-gray-50"
      } flex items-center justify-center`}
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
