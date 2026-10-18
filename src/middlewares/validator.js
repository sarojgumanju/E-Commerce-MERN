import * as z from "zod";

const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next(); 
    } catch (error) {
        // if (error instanceof z.ZodError) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Validation failed.",
        //         errors: error.issues.map((issue) => ({
        //             field: issue.path.join("."),
        //             message: issue.message,
        //         })),
        //     });
        // }

        if(error instanceof z.ZodError){
            const formattedError = z.treeifyError(error);
            // const formattedError = z.prettifyError(error);
            return res.status(400).send(formattedError);
        }

        res.status(400).send(error);
    }
};

export default validate; 