// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract NewBusSafe {
    struct checkList {
        address checker;
        string carNo;
        string checkResult;
        string checkEtc;
        uint64 checkTime;
    }

    struct Car {
        checkList[] check_list;
        uint64 count;
    }

    // hash table(js object) 만드는 키워드
    mapping(string => Car) cars;

    function AddCheckList(
        string memory _car_no,
        string memory _check_result,
        string memory _check_etc,
        uint64 _check_time
    ) public {
        address checker = msg.sender;
        cars[_car_no].check_list.push(
            checkList(checker, _car_no, _check_result, _check_etc, _check_time)
        );
        cars[_car_no].count++;
    }

    // 3. Retrieve all CheckList function
    function GetAllCheckList(string memory _car_no)
        public
        view
        returns (checkList[] memory)
    {
        return cars[_car_no].check_list;
    }
}
