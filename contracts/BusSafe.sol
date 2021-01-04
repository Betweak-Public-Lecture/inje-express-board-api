// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract BusSafe {
    // Bus 안전점검 점검표 등록하는 Contract

    struct checkList {
        address checker;
        string carNo;
        string checkResult;
        string checkEtc;
        uint64 checkTime;
    }

    uint32 checkCount; // 전체 cheeckList의 개수
    checkList[] public check_list; // 저장할 target 변수

    // 1. checkList Register function
    function AddCheckList(
        string memory _carNo,
        string memory _checkResult,
        string memory _checkEtc,
        uint64 _checkTime
    ) public {
        address _checker = msg.sender;
        check_list.push(
            checkList(_checker, _carNo, _checkResult, _checkEtc, _checkTime)
        );
        checkCount++;
    }

    // 3. total count of checklist
    function GetTotalCount() public view returns (uint32) {
        return checkCount;
    }

    // 2. Retrieve checkList function
    function GetCheck(uint64 _index)
        public
        view
        returns (
            address,
            string memory,
            string memory,
            string memory,
            uint64
        )
    {
        return (
            check_list[_index].checker,
            check_list[_index].carNo,
            check_list[_index].checkResult,
            check_list[_index].checkEtc,
            check_list[_index].checkTime
        );
    }

    // 3. Retrieve all CheckList function
    function GetAllCheckList() public view returns (checkList[] memory) {
        return check_list;
    }
}
