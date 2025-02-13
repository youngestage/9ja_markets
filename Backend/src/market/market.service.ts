import { ErrorMessages } from "../constants/error-messages.enum";
import { MarketRepository } from "../repositories/market.repository";
import { InternalServerException } from "../utils/exceptions/internal-server.exception";
import { NotFoundException } from "../utils/exceptions/not-found.exception";
import { WinstonLogger } from "../utils/logger/winston.logger";
import { MarketCreateDto } from "./dtos/market-create.dto";
import { MarketUpdateDto } from "./dtos/market-update.dto";

export class MarketService {
    constructor(
        private readonly marketRepository: MarketRepository,
        private readonly logger: WinstonLogger
    ) { }

    async createMarket(market: MarketCreateDto) {
        try {
            const createdMarket = await this.marketRepository.createMarket(market);
            return createdMarket;
        } catch (e) {
            this.logger.error(`${ErrorMessages.CREATE_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.CREATE_MARKET_FAILED);
        }
    }

    async findMarketNames() {
        try {
            const names = await this.marketRepository.findNames();
            return names;
        } catch (e) {
            this.logger.error(`${ErrorMessages.GET_MARKET_NAMES_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.GET_MARKET_NAMES_FAILED);
        }
    }

    async getMarketById(id: string) {
        try {
            const market = await this.marketRepository.findById(id);
            if (!market) {
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }
            return market;
        } catch (e) {
            this.logger.error(`${ErrorMessages.GET_MARKET_BY_ID_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.GET_MARKET_BY_ID_FAILED);
        }
    }

    async getMarketByName(name: string) {
        try {
            const market = await this.marketRepository.findByName(name);
            if (!market) {
                throw new NotFoundException(ErrorMessages.MARKET_NOT_FOUND);
            }
            return market;
        } catch (e) {
            this.logger.error(`${ErrorMessages.GET_MARKET_BY_NAME_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.GET_MARKET_BY_NAME_FAILED);
        }
    }

    async updateMarket(marketId: string, marketUpdateDto: MarketUpdateDto) {
        try {
            const updatedMarket = await this.marketRepository.updateMarket(marketId, marketUpdateDto);
            return updatedMarket;
        } catch (e) {
            this.logger.error(`${ErrorMessages.UPDATE_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.UPDATE_MARKET_FAILED);
        }
    }

    async deleteMarket(marketId: string) {
        try {
            await this.marketRepository.deleteMarket(marketId);
            return true;
        } catch (e) {
            this.logger.error(`${ErrorMessages.DELETE_MARKET_FAILED}: ${e}`);
            throw new InternalServerException(ErrorMessages.DELETE_MARKET_FAILED);
        }
    }
}