import React, { useEffect } from 'react'
import axios from 'axios';

function LandingPage() {
    
    
    useEffect(() => { // ∇1. 백엔드로 요청을 보냄
        axios.get('/api/hello') // get으로 보냈으니 get으로 받아옴 
        .then(response => console.log(response.data)) // ∇5. 콘솔로그로 받아온것을 뛰여옴 
    }, [])


    return (
        <div>
            LandingPage 처음 나오는 페이지
        </div>
    )
}

export default LandingPage
