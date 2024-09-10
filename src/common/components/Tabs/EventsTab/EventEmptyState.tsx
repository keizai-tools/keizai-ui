function EventEmptyState() {
  return (
    <div
      className="flex justify-center items-center my-20 flex-1"
      data-test="events-tab-empty-state-container"
    >
      <img
        src="/searching.svg"
        alt="Search events"
        width={270}
        height={270}
        loading="eager"
        data-test="events-tab-content-img"
      />
      <div className="flex flex-col gap-3">
        <div
          className="flex flex-col justify-center text-primary font-black"
          data-test="events-tab-content-text"
        >
          <h2 className="text-5xl">Run the contract</h2>
          <h2 className="text-4xl">to see the events</h2>
        </div>
      </div>
    </div>
  );
}

export default EventEmptyState;
