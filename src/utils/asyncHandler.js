// export const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) =>
//             next(err)
//         );
//     };
// };

export const asyncHandler = (func) = async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (err) {
        return res.status(err.code || 5000).json({
            success: false,
            message: err.message,
        });
    }
};
