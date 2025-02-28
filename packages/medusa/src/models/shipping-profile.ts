import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm"

import { DbAwareColumn, generateEntityId } from "../utils"
import { Product } from "./product"
import { ShippingOption } from "./shipping-option"
import { SoftDeletableEntity } from "../interfaces"

export enum ShippingProfileType {
  DEFAULT = "default",
  GIFT_CARD = "gift_card",
  CUSTOM = "custom",
}

@Entity()
export class ShippingProfile extends SoftDeletableEntity {
  @Column()
  name: string

  @DbAwareColumn({ type: "enum", enum: ShippingProfileType })
  type: ShippingProfileType

  @ManyToMany(() => Product)
  @JoinTable({
    name: "product_shipping_profile",
    joinColumn: {
      name: "profile_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[]

  @OneToMany(() => ShippingOption, (so) => so.profile)
  shipping_options: ShippingOption[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sp")
  }
}

/**
 * @schema ShippingProfile
 * title: "Shipping Profile"
 * description: "Shipping Profiles have a set of defined Shipping Options that can be used to fulfill a given set of Products."
 * type: object
 * required:
 *   - created_at
 *   - deleted_at
 *   - id
 *   - metadata
 *   - name
 *   - type
 *   - updated_at
 * properties:
 *   id:
 *     description: The shipping profile's ID
 *     type: string
 *     example: sp_01G1G5V239ENSZ5MV4JAR737BM
 *   name:
 *     description: The name given to the Shipping profile - this may be displayed to the Customer.
 *     type: string
 *     example: Default Shipping Profile
 *   type:
 *     description: The type of the Shipping Profile, may be `default`, `gift_card` or `custom`.
 *     type: string
 *     enum:
 *       - default
 *       - gift_card
 *       - custom
 *     example: default
 *   products:
 *     description: The Products that the Shipping Profile defines Shipping Options for. Available if the relation `products` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/Product"
 *   shipping_options:
 *     description: The Shipping Options that can be used to fulfill the Products in the Shipping Profile. Available if the relation `shipping_options` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ShippingOption"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
