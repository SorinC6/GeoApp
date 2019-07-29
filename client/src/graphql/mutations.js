export const CREATE_PIN_MUTATION = `
    mutation($title:String!,$image:String!,$content:String!,$longitude:Float!,$latitude:Float!){
        createPin(input: {
            title:$title,
            image:$image,
            content:$content
            longitude:$longitude
            latitude:$latitude,
        }) {
            _id
            createdAt
            title
            image
            content
            longitude
            latitude
            author{
                _id
                name
                email
                picture
            }
        }
    }
`;
