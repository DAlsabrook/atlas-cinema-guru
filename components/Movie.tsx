import { Title } from "@/lib/definitions"

export function Movie (props: Title) {
  const title = props
  return (
      <div className="flex flex-col border-1 border-green-light rounded-md overflow-hidden my-2 mx-5">
        <img src={title.image} alt={title.title} />
        {/* <h3>{title.title}</h3>
        <p>{title.synopsis}</p>
        <p>Released: {title.released}</p>
        <p>Genre: {title.genre}</p> */}
      </div>
    )
}
