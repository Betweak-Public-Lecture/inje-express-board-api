const express = require('express');
const router = express.Router();

const db = require('../../models/db');

/**
 * HTTP Method의 종류 (4가지)
 * 1. GET    (조회)
 * 2. POST   (생성 or 등록)
 * 3. PUT    (수정 or 갱신)
 * 4. DELETE (삭제)
 */

//  router.<method>

// GET '/',  모든 게시글을 조회한다. 
// SQL(Structured Query Language) : Database에게 명령을 내리는 언어.
router.get('/', (req, res)=>{
    const sql = 'SELECT * FROM board WHERE is_deleted=?';
    db.query(sql, [0],(err, rows)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.json({
                status: "Success",
                result: rows
            })
        }
    })
});

// GET '/:boardId', 게시글의 상세조회
// router에서 ':'이 들어간 url은 parameter(변수)로 url을 입력받겠다.
// + 댓글까지 가져오기
router.get('/:boardId', function(req, res){
    const boardId = req.params.boardId;
    const sql = 'SELECT * FROM board WHERE id=? and is_deleted=?';
    db.query(sql, [boardId, 0], (err, rows)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            if(rows.length <1){
                res.status(404).json({
                    status: "Fail",
                    result: "Resource is deleted"
                })
            } else{
                res.json({
                    status: "Success",
                    result: rows[0]
                })
            }
        }
    })
});

// POST '/'  게시글 생성
// 게시글을 생성.
// INSERT INTO <tableName>(<column1, column2, ...>) VALUES(<'value1', 'value2'>);
router.post('/', (req, res)=>{
    const {title, content} = req.body;
    const sql = "INSERT INTO board(title, content) VALUES(?, ?)"
    db.query(sql, [title, content], (err, result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(201).json({
                status: "Success",
                result: result
            })
        }
    })
});

// PUT '/:boardID' 게시글 수정
// UPDATE <tableName> SET column1=<수정할 column value>, column2=<수정할 column value> WHERE <조건>;
router.put('/:boardId', (req, res)=>{
    const {title, content} = req.body;
    const sql = "UPDATE board SET title=?, content=? WHERE id=? and is_deleted=?";
    db.query(sql, [title, content, req.params.boardId, 0], (err, result)=>{
        if (err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
})

// DELETE '/:boardId' 게시글 삭제
// DELETE FROM <tableName> WHERE <조건>
router.delete('/:boardId', (req, res)=>{
    const boardId = req.params.boardId;
    // const sql = "DELETE FROM board WHERE id=?"; // 물리적삭제
    const sql = "UPDATE board SET is_deleted=? WHERE id=?"; // 논리적삭제

    db.query(sql, [1, boardId], (err, result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
})


// Comment에 대한 API (CRUD)


// POST '/:boardId/comment'  댓글 달기
router.post('/:boardId/comment', (req, res)=>{
    const boardId = req.params.boardId;
    const content = req.body.content

    const sql = "INSERT INTO comment (content, board_id) VALUES(?, ?)";
    db.query(sql, [content, boardId], (err, result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else {
            res.status(200).json({
                status:"Success",
                result:result
            })
        }
    })
});


// GET '/:boardId/comment'  댓글 리스트 조회
router.get('/:boardId/comment', (req, res)=>{
    const boardId = req.params.boardId;

    const sql = "SELECT * FROM comment WHERE board_id=?";
    db.query(sql, [boardId], (err, result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else{
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
})


// DELETE  '/comment/:commentId'  댓글 삭제
router.delete('/comment/:commentId', (req, res)=>{
    const commentId = req.params.commentId;

    const sql = "DELETE FROM comment WHERE id=?";
    db.query(sql, [commentId], (err, result)=>{
        if(err){
            res.status(500).json({
                status: "Fail",
                result: "DB Error"
            })
        } else {
            res.status(200).json({
                status: "Success",
                result: result
            })
        }
    })
})









module.exports = router;
