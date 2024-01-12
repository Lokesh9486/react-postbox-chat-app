const {Schema,model,SchemaTypes}=require("mongoose");

const chatSchema=new Schema({
    message:String,
    participants:{
        type:[SchemaTypes.ObjectId],
        required:true,
        ref:"user"
    },
    sendedBy:SchemaTypes.ObjectId,
    seenedBy:[SchemaTypes.ObjectId]
},{
    timestamps:true
});


module.exports=model("chatpage",chatSchema);