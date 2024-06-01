class Rank {
    constructor(id, user_id, subject_id, votes){
        this.id = id;
        this.user_id = user_id;
        this.subject_id = subject_id;
        this.votes = votes;
    }
}

module.exports = Rank;