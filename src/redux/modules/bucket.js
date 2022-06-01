// bucket.js
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";



// Actions
const LOAD = "bucket/LOAD";
const CREATE = "bucket/CREATE";
const UPDATE = "bucket/UPDATE";
const DELETE = "bucket/DELETE";
const LOADED = "bucket/LOADED";

const initialState = {
  is_loaded: false,
  list: [],
};



// Action Creators
export function loadBucket(bucket_list) {
  return { type: LOAD, bucket_list };
}

export function createBucket(bucket) {
  console.log("액션을 생성할거야!");
  return { type: CREATE, bucket: bucket };
}

export function updateBucket(bucket_index) {
  return { type: UPDATE, bucket_index };
}

export function deleteBucket(bucket_index) {
  console.log("지울 버킷 인덱스", bucket_index);
  return { type: DELETE, bucket_index };
}

export function isLoaded(loaded) {
  return { type: LOADED, loaded };
}






// middlewares
export const loadBucketFB = () => {
  return async function (dispatch) {
    const bucket_data = await getDocs(collection(db, "bucket"));
    console.log(bucket_data);

    let bucket_list = [];

    bucket_data.forEach((b) => {
      console.log(b.data());
      bucket_list.push({ id: b.id, ...b.data() });
    });

    console.log(bucket_list);

    dispatch(loadBucket(bucket_list));
  };
};

export const addBucketFB = (bucket) => {
  return async function (dispatch) {
    dispatch(isLoaded(false));
    const docRef = await addDoc(collection(db, "bucket"), bucket);
        // console.log((await getDoc(docRef)).data());
    // docRef의 형식이 document 이므로 데이터를 가져오려면 'getDoc'을 써서 가져와야함.

    const _bucket = await getDoc(docRef);
    // 리덕스에 넣기 위해 필요한 정보 : 아이디, 도큐먼트 데이터들(텍스트, 컴플리트)
    // await에서 document 하나에 있는 정보를 가지고 오는 것을 상수로 선언한다.
    // getDoc으로 FireStore에 있는 정보를 가지고 왔다.
    // 하지만 생각해보면 굳이 가져오지 않아도 bucket에 데이터가 전부 들어있다.
    // 필요한 것 : id
    // 그럼 굳이 FireStore에서 정보를 가져오기 위해 기다리지 않아도 된다.
    

    const bucket_data = { id: _bucket.id, ...bucket.data() };
    // const bucket_data = { id: docRef.id, ...bucket}; 라고 해도 됨
    // 이미 버킷에 다 들어있으므로
    // id 는 docRef 에 있는 id이고, 이 버킷에 있는 내용 전부 꺼내 줘라! 리고 할 수도 있음.

    dispatch(createBucket(bucket_data));

    // 혹은 bucket_data 선언하지 않고,
    // dispatch(createBucket({ id: _bucket.id, ...bucket.data() })); 로 해도됨
  };
};

export const updateBucketFB = (bucket_id) => {
  // 기능이 '완료하기' 뿐이기 때문에 bucket 데이터는 필요없음. id만 가져옴.
  return async function (dispatch, getState) {
    //두번째 인자 getState로 bucket_id 받아와서 리덕스 수정할때 사용 !
    
    // console.log(bucket_id) 잘가져오는지 확인

    const docRef = doc(db, "bucket", bucket_id);
    // 어떤 것을 업데이트 해줄건지. doc(내가 설정한 파이어스토어, 어떤 컬렉션, 도큐먼트 아이디)

    await updateDoc(docRef, { completed: true });
    // updateDoc(업데이트 해줄 도큐먼트, {어떻게 수정할지})
    // 끝나면 리덕스 데이터 수정해줘야 하기 때문에 앞에 await 걸기 !

    console.log(getState().bucket);
    // 버킷의 리스트 정보 긁어오기(두번째 인자 getState 사용 !)

    const _bucket_list = getState().bucket.list;
    // 여기서 이제 index를 찾아줘야함.
    // 이유 : updateBucket 액션이 index를 받기 때문 !

    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
      // --> array의 내장함수 findIndex로 index 찾기 !
      // b(_bucket_list)가 갖고 있는 id가, bucket_id 와 같으면 리턴해주기 !

      // 파라미터로 받아온 버킷아이디와 아이디가 똑같은 것이 있니?
      // 있다면 그것의 인덱스 가져와
    });

    // console.log(bucket_index) 잘 나오는 지 확인

    dispatch(updateBucket(bucket_index));
    // updateBucket 액션 일으키기 ! 인자는 가져온 bucket_index !
     

  };
};

export const deleteBucketFB = (bucket_id) => {
  return async function (dispatch, getState) {
    if (!bucket_id) {
      window.alert("아이디가 없네요!");
      return;
      // 밑의 구문을 들어가지 못하게 하기
      // 버킷 아이디가 없을 경우 에러가 뜨는 것을 방지하기 위해 만듦
      // --> 파라미터가 꼭 필요한 것들을 작업할 때는, 파라미터가 없을 경우도 대비해야함
      // --> 원래는 업데이트에도 들어가야함
    }
    const docRef = doc(db, "bucket", bucket_id);
    // 뭐를 지울지 선언
  
    await deleteDoc(docRef);
    // 어떤 도큐먼트 지울지 쓰기 --> docRef
  
    // --리덕스에 들어가 있는 데이터 지워주기----
    const _bucket_list = getState().bucket.list; // 버킷에 있는 리스트 정보 긁어오기
    
    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
      // 이 리스트 정보에서 파라미터로 받아온 bucket_id랑 id가 똑같은 게 있니?
      // id가 똑같은 게 있다면 걔 인덱스 가져와
    });

    dispatch(deleteBucket(bucket_index));
    // 가져온 인덱스 넣어서 업데이트 해주기
  };
};





// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "bucket/LOAD": {
      return { list: action.bucket_list, is_loaded: true };
    }
    case "bucket/CREATE": {
      console.log("이제 값을 바꿀거야!");
      const new_bucket_list = [...state.list, action.bucket];
      return { ...state, list: new_bucket_list, is_loaded: true };
    }

    case "bucket/UPDATE": {
      const new_bucket_list = state.list.map((l, idx) => {
        if (parseInt(action.bucket_index) === idx) {
          return { ...l, completed: true };
        } else {
          return l;
        }
      });
      console.log({ list: new_bucket_list });
      return { ...state, list: new_bucket_list };
    }

    case "bucket/DELETE": {
      const new_bucket_list = state.list.filter((l, idx) => {
        return parseInt(action.bucket_index) !== idx;
      });

      return { ...state, list: new_bucket_list };
    }

    case "bucket/LOADED": {
      return { ...state, is_loaded: action.loaded };
    }
    default:
      return state;
  }
}
