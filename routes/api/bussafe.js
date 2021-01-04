const express = require('express');
const router = express.Router();

const {web3, smartContract} = require('../../lib/web3');
// console.log(web3);
// console.log(smartContract);

// smartContract 공통점.
// smartcontract.methods.<functionName>
// 기본적으로 methods는 모두 비동기함수.
// smartContract.methods.GetTotalCount().call().then(
//   data=>{
//     console.log(data);
//   }
// )

const db = require('../../models/db');

router.get('/car', (req, res)=>{
  const sql = "SELECT * FROM car_list";
  db.query(sql, (err, rows)=>{
    if(err){
      res.json({
        status: "Fail",
        result: "DB Error"
      })
    } else{
      res.json({
        status: "Success",
        result: rows
      });
    }
  })
})

router.get('/car/:carId', (req, res)=>{
  const carId = req.params.carId;
  const sql = "SELECT * FROM car_list WHERE id=?";
  db.query(sql, [carId], (err, rows)=>{
    if(err){
      res.json({
        status: "Fail",
        result: "DB Error"
      })
    } else{
      res.json({
        status: "Success",
        result: rows[0]
      })
    }
  })
})

router.post('/car', (req, res)=>{
  const {carNo, carType, carBirth} = req.body;
  const sql = "INSERT INTO car_list(car_no, car_type, car_birth) VALUES(?, ?, ?)";
  db.query(sql, [carNo, carType, carBirth], (err, result)=>{
    if(err){
      res.json({
        status: "Fail",
        result: "DB Error"
      })
    } else{
      res.json({
        status: "Success",
        result: result
      })
    }
  })
})


router.get('/', (req,res)=>{
  res.json({});
})

router.get('/count', (req, res)=>{
  smartContract.methods.GetTotalCount().call().then(count=>{
    res.json({
      status: "Success",
      result: count
    });
  }).catch(err=>{
    console.error(err);
    res.json({
      status: "Fail",
      result: "Network Error"
    })
  })
})

// "inputs": [
//   {
//     "internalType": "string",
//     "name": "_carNo",
//     "type": "string"
//   },
//   {
//     "internalType": "string",
//     "name": "_checkResult",
//     "type": "string"
//   },
//   {
//     "internalType": "string",
//     "name": "_checkEtc",
//     "type": "string"
//   },
//   {
//     "internalType": "uint64",
//     "name": "_checkTime",
//     "type": "uint64"
//   }
// ],
web3.eth.getAccounts().then(accounts=>{
  console.log(accounts)
})


router.post('/checklist', (req, res)=>{
  const {carNo, checkResult, checkEtc} = req.body;
  const checkTime = parseInt(Date.now());

  console.log(req.body);

  web3.eth.getAccounts().then(accounts=>{
    const account = accounts[0];
    smartContract.methods.AddCheckList(carNo, checkResult, checkEtc, checkTime).send({
      from: account,
      gas: "300000"  // gas한도 이상으로 gas가 소요될경우 에러발생
    }).then(result=>{
      console.log(result);
      res.json({
        status: "Success",
        result: result
      })
    }).catch(err=>{
      console.error(err);
      res.json({
        status: "Fail",
        result: "Network Error"
      })
    })
  })
  // account는 어디에?
});

router.get('/checklist/:carNo', (req, res)=>{
  const carNo = req.params.carNo;

  smartContract.methods.GetTotalCount().call().then(count=>{
    console.log(count);

    // const targetCheckList = [];
    smartContract.methods.GetAllCheckList().call().then(checklist=>{
      console.log(checklist);
      let targetCheckList = [];
      for (let check of checklist){
        if(check[1] === carNo){
          targetCheckList.push(check);
        }
      }
      res.json({
        status: "Success",
        result: targetCheckList
      })
    }).catch(err=>{
      res.json({
        status: "Fail",
        result: "Network Error"
      });
    })

    // for (let i=0; i<count; i++){
    //   smartContract.methods.GetCheck(i).call().then(check=>{
    //     console.log(check);

    //     if(carNo === check[1]){
    //       targetCheckList.push(check);
    //     }

    //   })
    // }
    // setTimeout(()=>{
    //   res.json({
    //     status: "Success",
    //     result: targetCheckList
    //   })
    // }, 2000)
    // return res.json({
    //   status: "Success",
    //   result: targetCheckList
    // })
  })
})


// Test for NewBusSafe.sol
router.get('/test', (req, res)=>{
  const carNo = 'abc123';
  smartContract.methods.GetAllCheckList(carNo).call().then(data=>{
    console.log(data);
    res.json({
      status:"Okay",
      result:data
    })
  })
})



// function AddCheckList(
//   string memory _car_no,
//   string memory _check_result,
//   string memory _check_etc,
//   uint64 _check_time
router.post('/test', (req, res)=>{
  const {carNo, checkResult, checkEtc} = req.body;
  const checkTime = parseInt(Date.now());

  smartContract.methods.AddCheckList(carNo, checkResult, checkEtc, checkTime).send({
    from: '0xdfa93fe2f2d6183030bb67dacea326620feb2119',
    gas: "300000"
  }).then (data=>{
    console.log(data);
    res.json({
      status: "Okay",
      result: data
    })
  })
})


module.exports = router;