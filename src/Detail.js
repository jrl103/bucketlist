import React from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteBucket,
  updateBucket,
  deleteBucketFB,
  updateBucketFB,
} from "./redux/modules/bucket";
import Button from "@mui/material/Button";

const Detail = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const bucket_index = params.index;
  const bucket_list = useSelector((state) => state.bucket.list);

  return (
    <div>
      <h1>{bucket_list[bucket_index] ? bucket_list[bucket_index].text : ""}</h1>
      // bucket_list의 bucket_index 번째 거가 없으므로 text라는 값을 가져올 수 없다는 에러가 뜸
      // 이유 : FireStore에서 데이터를 가져오는데 시간이 필요함
      // 그런데 bucket_list[bucket_index] 가 이미 화면에 그려지고 있는 거임
      // so, 지금 bucket_list 데이터가 없는데, 없는 거에서 텍스트를 찾으려고 하니까 에러가 남
      // --> 삼항연산자 사용!

      
      <Button
        variant="outlined"
        onClick={() => {
          // dispatch(updateBucket(bucket_index));
          dispatch(updateBucketFB(bucket_list[bucket_index].id));
          // 우리한테 필요한 것은  bucket_index기 아니라 id !
          // id는 FireStore에서 가지고 온 데이터에 들어있음 --> data.id 해주기 !
          // (loadBucketFB, addBucketFB할 때 데이터 모양을 그렇게 만들어줌)
          //
        }}
      >
        완료하기
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => {
          // console.log("삭제하기 버튼을 눌렀어!");
          // dispatch(deleteBucket(bucket_index));
          dispatch(deleteBucketFB(bucket_list[bucket_index].id));
          
          history.goBack();
        }}
      >
        삭제하기
      </Button>
    </div>
  );
};

export default Detail;
