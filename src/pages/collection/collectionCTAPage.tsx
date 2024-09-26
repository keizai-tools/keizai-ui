export default function CollectionCTAPage() {
  return (
    <div
      className="flex flex-wrap items-center justify-center w-full gap-12 mt-48 h-fit"
      data-test="collection-empty-invocation-container"
    >
      <img
        src="/moon.svg"
        width={300}
        height={300}
        data-test="collection-empty-invocation-img"
        alt="No invocation selected"
        className="transition-transform duration-500 transform hover:scale-110"
      />
      <div data-test="collection-empty-invocation-description">
        <h1 className="text-2xl text-primary">
          Select an invocation from the sidebar
        </h1>
        <h3 className="text-xl text-slate-400">Or create a new one</h3>
      </div>
    </div>
  );
}
