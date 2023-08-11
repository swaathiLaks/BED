//  Swaathi Lakshmanan
//  P2227171
//  DISM/FT/2B/21
const insert = require('../models/myDefaultFn');
var jwt =require('jsonwebtoken');
const config = require('../config')
const verify = {
    verifyToken : function(req,res,next){
        const authHeader = req.headers['authorization']
        if (!authHeader|| !authHeader.includes('Bearer')){
            res.status(403).send({auth:'false', message:'authentication error'})
        }else{
            const token = authHeader.replace('Bearer ', '')
            jwt.verify(token, config.key, function(err, payload){
                if (err){
                    res.status(403)
                    return res.send({auth: false, message:'authentication failed'})
                }else{
                    req.payload = payload
                    next()
                }
            })
        }
    },

    verifyAdmin : function(req,res,next){
        if (req.payload.role == 'Admin'){
            next()
        }else{
            res.status(403)
            return res.send({auth: false, message:'authentication failed'})
        }
        
    }
}

module.exports = verify;