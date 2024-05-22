const QuestionSummary = ({ question }) => {
    console.log(question);  
return (
    <div key={question.id} className="bg-white p-4 shadow">
        <h3 className="text-xl font-bold">{question.text}</h3>
        <div className="flex items-center">
            <img className="w-8 h-8 rounded-full" src={question.user.profile_picture} alt="Profile Picture" />
            <p className="ml-2">{question.user.username}</p>
        </div>
    </div>
);
};

export default QuestionSummary;
