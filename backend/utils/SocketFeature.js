class SocketFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        
    }
    paginate(resultPerPage){
        const currentPage=Number(this.queryStr.page||1);
        const skip=resultPerPage*(currentPage-1);
        this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}