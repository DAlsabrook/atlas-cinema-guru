import { Title } from "@/lib/definitions";

export function Movie(props: Title) {
  const title = props;
  return (
    <div className="relative flex flex-col border border-green-light rounded-md overflow-hidden my-2 mx-9 group">
      <img src={title.image} alt={title.title} className="w-full h-auto" />
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-blue-atlas opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end text-white p-4">
        <h3 className="text-lg font-bold">{title.title} ({title.released})</h3>
        <p className="text-sm">{title.synopsis}</p>
        <p className="text-sm w-fit bg-green-light rounded-2xl py-1 px-2 mt-2">{title.genre}</p>
      </div>
    </div>
  );
}
