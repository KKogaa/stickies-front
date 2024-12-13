
interface CardProps {
  index: number;
  title?: string;
  body?: string;
  email?: string;
}


function Card({ index, title, body, email }: CardProps) {
  return (
    <div key={index} className="card bg-primary text-primary-content lg:w-94 
            sm:w-auto m-4">
      <div className="card-body p-auto">
        <div className="flex justify-between">
          <h2 className="card-title">{title}</h2>
          <h2 className="text-secondary">{email}</h2>
        </div>
        <p className="text-left">{body}</p>
      </div>
    </div>
  )

}

export default Card;
