- setting up env variables in cloudinary file
    - The code was executing before the server start, i figured out by config env variables in the cloudinary file before configuring cloudinary.

- when user details is not present in the db, in that case images are uploaded to server and after uploading to cloudinary it will unlink but when user is already exist, it is not unlink from the server
    - create a removeFiles for unlinking the file from the server and import this file in the cloudinary file as well as user controller file and call this function before when user is already in the db.

- while creating for aggregation pipeline for watch history, i have passed user id directly.
    - Id is a string type and By default when we use findById in mongoose and give a id mongoose internally convert this string to a mongodb object but this thing does not works in aggregation. In aggregation whatever we have written it directly go to mongo, so there is a type mismatch. for this i have used new mongoose.Types.ObjectId(id) to typecast to mongo object.