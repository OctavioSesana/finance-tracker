import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export class UserService {
    private userRepository = AppDataSource.getRepository(User);
    
    // En producción, esto debería venir de process.env.JWT_SECRET
    private readonly JWT_SECRET = "SmartMarket_Secret_Key_2025"; 

    // --- REGISTRO ---
    async register(userData: any) {
        // 1. Verificar si el email ya existe
        const existingUser = await this.userRepository.findOne({ 
            where: { email: userData.email } 
        });
        
        if (existingUser) {
            throw new Error("El correo electrónico ya está registrado.");
        }

        // 2. Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // 3. Crear y guardar DIRECTAMENTE
        // Usamos .save() con un objeto literal. Esto le dice a TypeScript:
        // "Oye, esto es UN solo objeto, no una lista".
        const savedUser = await this.userRepository.save({
            ...userData,
            password: hashedPassword
        });

        // 4. Retornar datos (Ahora sí detectará las propiedades)
        const { password, ...userWithoutPassword } = savedUser;
        
        return { message: "Usuario registrado con éxito", user: userWithoutPassword };
    }

    // --- LOGIN ---
    async login(credentials: { email: string, password: string }) {
        // 1. Buscar usuario por Email
        const user = await this.userRepository.findOne({ 
            where: { email: credentials.email } 
        });

        if (!user) {
            throw new Error("Credenciales inválidas (Usuario no encontrado)");
        }

        // 2. Comparar contraseñas (Lo que escribió vs Lo encriptado en BD)
        const isMatch = await bcrypt.compare(credentials.password, user.password);
        
        if (!isMatch) {
            throw new Error("Credenciales inválidas (Contraseña incorrecta)");
        }

        // 3. Generar Token JWT (La llave digital)
        const token = jwt.sign(
            { 
                userId: user.id, 
                email: user.email,
                name: user.name,
                lastName: user.lastName,
                password: user.password 
            }, 
            this.JWT_SECRET,
            { expiresIn: "24h" } // La sesión dura 1 día
        );

        return { 
            token, 
            user: { 
                id: user.id, 
                email: user.email, 
                firstName: user.name, 
                lastName: user.lastName,
                password: user.password 
            } 
        };
    }
}