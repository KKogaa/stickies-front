
interface CardProps {
  index: number;
  title: string;
  body: string;
}


function Card({ index, title, body }: CardProps) {
  return (
    <div key={index} className="card bg-primary text-primary-content lg:w-94 
            sm:w-auto m-4">
      <div className="card-body p-auto">
        <h2 className="card-title">Card title!</h2>
        <p className="text-left">If a dog chews shoes whose shoes does he choose?</p>
      </div>
    </div>
  )

}

export default Card;
