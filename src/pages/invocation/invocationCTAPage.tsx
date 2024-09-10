export default function InvocationCTAPage() {
  return (
    <div
      className="flex flex-col items-center justify-center w-full gap-8 md:flex-row mt-36 h-fit animate-fadeIn"
      data-test="collection-empty-invocation-container"
    >
      <img
        src="/searching.svg"
        width={300}
        height={300}
        data-test="collection-empty-invocation-img"
        alt="No invocation selected"
        className="transition-transform duration-500 transform hover:scale-110"
      />
      <div
        className="text-center md:text-left"
        data-test="collection-empty-invocation-description"
      >
        <h1 className="text-3xl font-bold text-primary drop-shadow-md">
          Upload a contract to get started
        </h1>
        <h3 className="mt-4 text-lg text-slate-400">
          or add the contract address to the sidebar
        </h3>
      </div>
    </div>
  );
}
