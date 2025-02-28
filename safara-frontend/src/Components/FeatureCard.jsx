
const FeatureCard = ({img,title,desc}) => {
    return (
        <div>
            <img src={img} className="w-20" alt="" />
            <h3 className="text-primary">{title}</h3>
            <p>{desc}</p>
            
        </div>
    );
};

export default FeatureCard;