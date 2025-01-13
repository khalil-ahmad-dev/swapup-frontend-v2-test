import { useState } from "react";
import { DrawerTrigger, Drawer, DrawerContent, DrawerTitle, DrawerClose, } from "@/components/ui/drawer";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomOutlineButton from "../../shared/CustomOutlineButton";
import { SUI_RarityRankItem } from "@/types/global.types";
import { availableRarityRanking } from "@/constants/data";


const FormSchema = z.object({
  collection: z.string().min(1, {
    message: "Please select an preferred collection."
  }),
  rarityRank: z.string().min(1, {
    message: "Please select an preferred rarity rank."
  })

});

interface IProp {
  children: any;
  setFilteredNftsByFilters: (collectionTitle: string, selectedRarityRank: SUI_RarityRankItem) => void;
  removeAllFilters: () => void;
  collections: [] | string[];
}

const PrivateRoomFilterDrawer = ({ children, setFilteredNftsByFilters, removeAllFilters, collections }: IProp) => {
  const [formKey, setFormKey] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      collection: '',
      rarityRank: ''
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { collection, rarityRank } = data;
    setFilteredNftsByFilters(collection, JSON.parse(rarityRank));
    setIsOpen(false);
  }

  const handleResetFilters = () => {
    form.reset({
      collection: "",
      rarityRank: "",
    });
    setFormKey(Math.random());
    removeAllFilters();
  };


  return (
    <>
      <Drawer open={isOpen} direction="right" onClose={() => setIsOpen(false)}  >
        <DrawerTrigger onClick={() => setIsOpen(true)}>
          {children}
        </DrawerTrigger>

        <DrawerContent
          className="p-3 h-screen w-9/12 lg:w-1/3 right-0 bg-transparent"
        >
          <DrawerClose
            className="bg-transparent fixed top-0 left-[-30%] lg:left-[-200%] h-screen w-[25vw] lg:w-[67vw]"
            onClose={() => setIsOpen(false)}
          ></DrawerClose>

          <div className="rounded-sm h-full w-full bg-su_secondary_bg flex flex-col gap-4 p-4" >
            <DrawerTitle className="text-su_primary" >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-xl pt-2" >Filter options</h2>
                <DrawerClose className="p-1 rounded-xs hover:bg-su_active_bg" onClick={() => setIsOpen(false)} >
                  <svg className="w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </DrawerClose>
              </div>

              <p className="text-su_secondary text-base font-medium" >Refine your search with custom filters:</p>
            </DrawerTitle>

            <div className="h-full space-y-2">
              <div className="flex justify-between items-center text-sm" >
                <p>Attributes</p>
                <button onClick={handleResetFilters} type="reset" className="flex items-center gap-2 py-1 px-2 rounded-sm hover:bg-su_active_bg" >
                  <svg className="w-3" viewBox="0 0 12 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12C4.46667 12 3.13067 11.4918 1.992 10.4753C0.853333 9.45889 0.200444 8.18933 0.0333333 6.66667H1.4C1.55556 7.82222 2.06956 8.77778 2.942 9.53333C3.81444 10.2889 4.83378 10.6667 6 10.6667C7.3 10.6667 8.40289 10.214 9.30867 9.30867C10.2144 8.40333 10.6671 7.30045 10.6667 6C10.6662 4.69956 10.2136 3.59689 9.30867 2.692C8.40378 1.78711 7.30089 1.33422 6 1.33333C5.23333 1.33333 4.51667 1.51111 3.85 1.86667C3.18333 2.22222 2.62222 2.71111 2.16667 3.33333H4V4.66667H0V0.666667H1.33333V2.23333C1.9 1.52222 2.59178 0.972222 3.40867 0.583333C4.22556 0.194444 5.08933 0 6 0C6.83333 0 7.614 0.158445 8.342 0.475333C9.07 0.792222 9.70333 1.21978 10.242 1.758C10.7807 2.29622 11.2084 2.92956 11.5253 3.658C11.8422 4.38645 12.0004 5.16711 12 6C11.9996 6.83289 11.8413 7.61356 11.5253 8.342C11.2093 9.07045 10.7816 9.70378 10.242 10.242C9.70244 10.7802 9.06911 11.208 8.342 11.5253C7.61489 11.8427 6.83422 12.0009 6 12Z" fill="#B6B6BD" />
                  </svg>

                  Reset
                </button>
              </div>

              <Form {...form} key={formKey}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="h-full pb-9 flex flex-col justify-between" >

                  <div className="space-y-3" >
                    <FormField
                      control={form.control}
                      name="collection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred collection:</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-su_enable_bg py-3 px-4 rounded-sm" >
                                <SelectValue className="" placeholder="Select collection" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {collections.map(collection => (
                                <SelectItem key={collection} value={collection}>{collection}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rarityRank"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred rarity rank:</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl >
                              <SelectTrigger className="bg-su_enable_bg py-3 px-4 rounded-sm" >
                                <SelectValue className="" placeholder={
                                  <span className="flex items-center gap-2" >
                                    <svg className="w-3" viewBox="0 0 16 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M10.29 4L8 0L5.71 4H10.29ZM2.29 10L0 14H16L13.71 10H2.29ZM13.14 9L10.86 5H5.14L2.86 9H13.14Z" fill="#868691" />
                                    </svg>

                                    Any
                                  </span>
                                } />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {
                                availableRarityRanking.map((rarityRank, index) => (
                                  <SelectItem key={index + rarityRank.from} value={JSON.stringify(rarityRank)} >
                                    <span className="flex items-center gap-2" >
                                      <svg className="w-3" viewBox="0 0 16 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.29 4L8 0L5.71 4H10.29ZM2.29 10L0 14H16L13.71 10H2.29ZM13.14 9L10.86 5H5.14L2.86 9H13.14Z" fill="#868691" />
                                      </svg>

                                      {rarityRank.from} - {rarityRank.to}
                                    </span>
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4" >
                    <CustomOutlineButton onClick={handleResetFilters} >
                      Clear filters
                    </CustomOutlineButton>

                    <Button variant={"default"} type="submit" >Apply filters</Button>

                  </div>
                </form>
              </Form>
            </div>
          </div>
        </DrawerContent>
      </Drawer >
    </>
  );
};

export default PrivateRoomFilterDrawer;