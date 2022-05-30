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
    const bucket_data = { id: docRef.id, ...bucket };

    dispatch(createBucket(bucket_data));
  };
};

export const updateBucketFB = (bucket_id) => {
  return async function (dispatch, getState) {
    // console.log(bucket_id)

    const docRef = doc(db, "bucket", bucket_id);
    // 어떤 것을 업데이트 해줄건지. doc(내가 설정한 파이어스토어, 어떤 컬렉션, 도큐먼트 아이디)

    await updateDoc(docRef, { completed: true });
    // updateDoc(업데이트 해줄 도큐먼트, {어떻게 수정할지})

    console.log(getState().bucket); // 버킷의 리스트 정보 긁어오기

    const _bucket_list = getState().bucket.list;
    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
      // 파라미터로 받아온 버킷아이디와 아이디가 똑같은 것이 있니?
      // 있다면 그것의 인덱스 가져와
    });

    // console.log(bucket_index)

    dispatch(updateBucket(bucket_index));
    // 가져온 인덱스 넣어서 업데이트
  };
};

export const deleteBucketFB = (bucket_id) => {
  return async function (dispatch, getState) {
    if (!bucket_id) {
      window.alert("아이디가 없네요!");
      return;
    }
    const docRef = doc(db, "bucket", bucket_id);
    await deleteDoc(docRef);

    const _bucket_list = getState().bucket.list;
    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
    });

    dispatch(deleteBucket(bucket_index));
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
